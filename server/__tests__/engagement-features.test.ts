import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Engagement Features', () => {
  describe('PDF Cheat Sheets', () => {
    const cheatsheetDir = path.join(__dirname, '../../client/public/cheatsheets');
    
    it('should have ABT Fundamentals cheat sheet PDF', () => {
      const pdfPath = path.join(cheatsheetDir, 'abt-fundamentals.pdf');
      expect(fs.existsSync(pdfPath)).toBe(true);
    });

    it('should have Coding Style cheat sheet PDF', () => {
      const pdfPath = path.join(cheatsheetDir, 'coding-style.pdf');
      expect(fs.existsSync(pdfPath)).toBe(true);
    });

    it('should have Commenting cheat sheet PDF', () => {
      const pdfPath = path.join(cheatsheetDir, 'commenting.pdf');
      expect(fs.existsSync(pdfPath)).toBe(true);
    });

    it('should have Technical Writing cheat sheet PDF', () => {
      const pdfPath = path.join(cheatsheetDir, 'technical-writing.pdf');
      expect(fs.existsSync(pdfPath)).toBe(true);
    });

    it('should have non-empty PDF files', () => {
      const pdfs = ['abt-fundamentals.pdf', 'coding-style.pdf', 'commenting.pdf', 'technical-writing.pdf'];
      pdfs.forEach(pdf => {
        const pdfPath = path.join(cheatsheetDir, pdf);
        const stats = fs.statSync(pdfPath);
        expect(stats.size).toBeGreaterThan(10000); // PDFs should be at least 10KB
      });
    });
  });

  describe('Course Images', () => {
    const imagesDir = path.join(__dirname, '../../client/public/images/courses');
    
    it('should have ABT Fundamentals course image', () => {
      const imagePath = path.join(imagesDir, 'abt-fundamentals.png');
      expect(fs.existsSync(imagePath)).toBe(true);
    });

    it('should have Coding Style course image', () => {
      const imagePath = path.join(imagesDir, 'coding-style.png');
      expect(fs.existsSync(imagePath)).toBe(true);
    });

    it('should have Commenting course image', () => {
      const imagePath = path.join(imagesDir, 'commenting.png');
      expect(fs.existsSync(imagePath)).toBe(true);
    });

    it('should have Technical Writing course image', () => {
      const imagePath = path.join(imagesDir, 'technical-writing.png');
      expect(fs.existsSync(imagePath)).toBe(true);
    });
  });

  describe('Component Files', () => {
    const componentsDir = path.join(__dirname, '../../client/src/components');
    
    it('should have QuickStartWalkthrough component', () => {
      const componentPath = path.join(componentsDir, 'QuickStartWalkthrough.tsx');
      expect(fs.existsSync(componentPath)).toBe(true);
      
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toContain('QuickStartWalkthrough');
      expect(content).toContain('steps');
      expect(content).toContain('isPlaying');
    });

    it('should have CheatSheetDownload component', () => {
      const componentPath = path.join(componentsDir, 'CheatSheetDownload.tsx');
      expect(fs.existsSync(componentPath)).toBe(true);
      
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toContain('CheatSheetDownload');
      expect(content).toContain('handleDownload');
      expect(content).toContain('pdf');
    });

    it('should have CourseBadge component', () => {
      const componentPath = path.join(componentsDir, 'CourseBadge.tsx');
      expect(fs.existsSync(componentPath)).toBe(true);
      
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toContain('CourseBadge');
      expect(content).toContain('isEarned');
      expect(content).toContain('courseId');
    });

    it('should have ShareBadge component', () => {
      const componentPath = path.join(componentsDir, 'ShareBadge.tsx');
      expect(fs.existsSync(componentPath)).toBe(true);
      
      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toContain('ShareBadge');
      expect(content).toContain('LinkedIn');
      expect(content).toContain('Twitter');
    });
  });

  describe('Course Catalog Page', () => {
    const pagesDir = path.join(__dirname, '../../client/src/pages');
    
    it('should have CourseCatalog page with QuickStartWalkthrough', () => {
      const pagePath = path.join(pagesDir, 'CourseCatalog.tsx');
      expect(fs.existsSync(pagePath)).toBe(true);
      
      const content = fs.readFileSync(pagePath, 'utf-8');
      expect(content).toContain('QuickStartWalkthrough');
      expect(content).toContain('See How It Works');
    });
  });

  describe('Badge Schema', () => {
    const schemaPath = path.join(__dirname, '../../drizzle/schema.ts');
    
    it('should have course completion badge types in schema', () => {
      const content = fs.readFileSync(schemaPath, 'utf-8');
      expect(content).toContain('abt_fundamentals_complete');
      expect(content).toContain('coding_style_complete');
      expect(content).toContain('commenting_complete');
      expect(content).toContain('technical_writing_complete');
      expect(content).toContain('all_courses_complete');
    });
  });

  describe('Profile Page Badges', () => {
    const profilePath = path.join(__dirname, '../../client/src/pages/Profile.tsx');
    
    it('should have course completion badges in Profile badgeInfo', () => {
      const content = fs.readFileSync(profilePath, 'utf-8');
      expect(content).toContain('abt_fundamentals_complete');
      expect(content).toContain('coding_style_complete');
      expect(content).toContain('commenting_complete');
      expect(content).toContain('technical_writing_complete');
      expect(content).toContain('all_courses_complete');
      expect(content).toContain('ShareBadge');
    });
  });

  describe('Router Badge Types', () => {
    const routerPath = path.join(__dirname, '../routers.ts');
    
    it('should have course completion badge types in router', () => {
      const content = fs.readFileSync(routerPath, 'utf-8');
      expect(content).toContain('abt_fundamentals_complete');
      expect(content).toContain('coding_style_complete');
      expect(content).toContain('commenting_complete');
      expect(content).toContain('technical_writing_complete');
      expect(content).toContain('all_courses_complete');
    });
  });
});
