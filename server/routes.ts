import type { Express } from "express";
import { createServer, type Server } from "http";
import * as cheerio from 'cheerio';
import AxePuppeteer from '@axe-core/puppeteer';
import puppeteer from 'puppeteer';
import { z } from "zod";
import { db } from "@db";
import { urls } from "@db/schema";
import { eq } from "drizzle-orm";
import { getDomain, isInternalLink, normalizeUrl } from "./utils";

const urlSchema = z.object({
  url: z.string().url()
});

export function registerRoutes(app: Express): Server {
  app.post("/api/check", async (req, res) => {
    try {
      const { url } = urlSchema.parse(req.body);
      const domain = getDomain(url);

      // Store the initial URL if not exists
      await db.insert(urls).values({
        url,
        domain,
        processed: false,
      }).onConflictDoNothing();

      console.log('Launching browser with system Chromium...');
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-extensions'
        ]
      });

      try {
        console.log('Creating new page...');
        const page = await browser.newPage();

        console.log('Setting viewport...');
        await page.setViewport({ width: 1280, height: 800 });

        console.log(`Navigating to ${url}...`);
        await page.goto(url, { 
          waitUntil: 'networkidle0',
          timeout: 30000
        });

        // Extract all links from the page
        const content = await page.content();
        const $ = cheerio.load(content);
        const links = new Set<string>();

        $('a').each((_, element) => {
          const href = $(element).attr('href');
          if (href) {
            const normalizedUrl = normalizeUrl(href, url);
            if (normalizedUrl && isInternalLink(normalizedUrl, domain)) {
              links.add(normalizedUrl);
            }
          }
        });

        // Store new internal links
        const linkArray = Array.from(links);
        for (const link of linkArray) {
          await db.insert(urls).values({
            url: link,
            parentUrl: url,
            domain,
            processed: false,
          }).onConflictDoNothing();
        }

        // Mark current URL as processed
        await db.update(urls)
          .set({ processed: true })
          .where(eq(urls.url, url));

        console.log('Running accessibility analysis...');
        const results = await new AxePuppeteer(page).analyze();

        // Transform results into our format with more WCAG details
        const issues = results.violations.map((violation: any) => {
          // Get detailed WCAG criteria info
          const wcagTags = violation.tags
            .filter((t: string) => t.startsWith('wcag'))
            .map((tag: string) => {
              try {
                const parts = tag.split('.');
                if (parts.length >= 3) {
                  const level = parts[1];
                  const criterion = parts[2];
                  return `WCAG ${level.toUpperCase()} ${criterion}`;
                }
                return tag;
              } catch (error) {
                console.error('Error parsing WCAG tag:', tag, error);
                return tag;
              }
            })
            .filter(Boolean)
            .join(', ');

          return {
            code: violation.id,
            type: 'error',
            message: violation.help,
            context: violation.nodes[0]?.html || '',
            selector: violation.nodes[0]?.target[0] || '',
            wcagCriteria: wcagTags || 'Not specified',
            impact: violation.impact as 'critical' | 'serious' | 'moderate' | 'minor',
            suggestion: violation.nodes[0]?.failureSummary || violation.description,
            helpUrl: violation.helpUrl,
            category: violation.tags
              .filter((t: string) => !t.startsWith('wcag'))
              .join(', ')
          };
        });

        // Return both the accessibility issues and the number of new links found
        res.json({ 
          issues,
          linksFound: links.size
        });

      } catch (error) {
        console.error('Error during page operations:', error);
        throw error;
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error('Error checking accessibility:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Failed to check accessibility'
      });
    }
  });

  // Add endpoint to get unprocessed URLs for a domain
  app.get("/api/pending-urls", async (req, res) => {
    try {
      const domain = req.query.domain as string;
      if (!domain) {
        return res.status(400).json({ message: "Domain parameter is required" });
      }

      const pendingUrls = await db.select()
        .from(urls)
        .where(
          eq(urls.domain, domain),
          eq(urls.processed, false)
        );

      res.json({ pendingUrls });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to fetch pending URLs'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}