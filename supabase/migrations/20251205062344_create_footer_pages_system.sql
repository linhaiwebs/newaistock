/*
  # Create Footer Pages System

  1. Purpose
    - Store footer page content (Privacy Policy, Terms of Service, Disclaimer, About Us, Contact)
    - Support editable footer pages from admin panel
    - Enable traditional multi-section footer with navigation links

  2. New Tables
    - `footer_pages`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text, not null) - Page title
      - `slug` (text, unique, not null) - URL-friendly identifier (e.g., 'privacy-policy')
      - `content` (text, not null) - Full page content (supports markdown or HTML)
      - `display_order` (integer, default 0) - Order in which pages appear in footer
      - `is_active` (boolean, default true) - Whether page is visible
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  3. Security
    - Enable RLS on `footer_pages` table
    - Public read access for active pages
    - Admin-only write access

  4. Indexes
    - Index on `slug` for fast lookups
    - Index on `display_order` for efficient ordering
    - Index on `is_active` for filtering active pages

  5. Initial Data
    - Populate with default footer pages (Privacy Policy, Terms, Disclaimer, About, Contact)
*/

-- Create footer_pages table
CREATE TABLE IF NOT EXISTS footer_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_footer_pages_slug ON footer_pages(slug);
CREATE INDEX IF NOT EXISTS idx_footer_pages_display_order ON footer_pages(display_order);
CREATE INDEX IF NOT EXISTS idx_footer_pages_is_active ON footer_pages(is_active);

-- Enable RLS
ALTER TABLE footer_pages ENABLE ROW LEVEL SECURITY;

-- Public read access for active pages
CREATE POLICY "Anyone can view active footer pages"
  ON footer_pages
  FOR SELECT
  USING (is_active = true);

-- Admin-only write access
CREATE POLICY "Admins can insert footer pages"
  ON footer_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update footer pages"
  ON footer_pages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete footer pages"
  ON footer_pages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_footer_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER footer_pages_updated_at
  BEFORE UPDATE ON footer_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_footer_pages_updated_at();

-- Insert default footer pages
INSERT INTO footer_pages (title, slug, content, display_order, is_active) VALUES
  (
    'Privacy Policy',
    'privacy-policy',
    E'# Privacy Policy\n\n## Information Collection\n\nThis website collects and processes data for informational purposes only.\n\n## Data Usage\n\nWe use publicly available market data to provide stock analysis visualizations. We do not collect personal financial information.\n\n## Third-Party Services\n\nWe may use third-party analytics services to understand how users interact with our website.\n\n## Data Security\n\nWe implement appropriate security measures to protect user data.\n\n## Contact\n\nFor privacy-related inquiries, please contact us through our Contact page.',
    1,
    true
  ),
  (
    'Terms of Service',
    'terms-of-service',
    E'# Terms of Service\n\n## Agreement to Terms\n\nBy accessing this website, you agree to be bound by these Terms of Service.\n\n## Service Description\n\nThis is a data analysis and visualization tool that displays publicly available stock market information. This service is provided for informational and educational purposes only.\n\n## Not Financial Advice\n\nWe do not provide investment advice, financial planning, or licensed financial services. All information is provided "as is" without warranty.\n\n## User Responsibilities\n\nUsers are solely responsible for their investment decisions. Always consult with licensed financial professionals before making investment decisions.\n\n## Limitation of Liability\n\nWe are not liable for any losses or damages resulting from use of this service.\n\n## Changes to Terms\n\nWe reserve the right to modify these terms at any time.',
    2,
    true
  ),
  (
    'Disclaimer',
    'disclaimer',
    E'# Disclaimer\n\n## Not Investment Advice\n\nThis website is a data analysis tool only. We do not provide investment advice or financial recommendations.\n\n## No Financial License\n\nWe do not hold any financial services licenses. We are not registered as investment advisors, broker-dealers, or financial planners.\n\n## Educational Purpose Only\n\nAll content is provided for informational and educational purposes only. It should not be construed as professional financial advice.\n\n## Market Data\n\nWe display publicly available market data and analysis. Data may be delayed or inaccurate.\n\n## No Guaranteed Returns\n\nPast performance does not guarantee future results. Investing involves risk, including potential loss of principal.\n\n## Consult Professionals\n\nAlways consult with licensed financial professionals before making investment decisions.',
    3,
    true
  ),
  (
    'About Us',
    'about-us',
    E'# About Us\n\n## Our Mission\n\nWe provide accessible stock market data visualization tools to help users understand publicly available market information.\n\n## What We Do\n\nOur platform aggregates and visualizes stock market data, presenting it in an easy-to-understand format. We use AI technology to analyze trends and patterns in historical data.\n\n## What We Don\'t Do\n\n- We do not provide investment advice\n- We do not hold financial services licenses\n- We do not manage investments or client funds\n- We do not guarantee investment returns\n\n## Technology\n\nWe leverage modern web technologies and AI to provide fast, reliable data visualization.\n\n## Educational Focus\n\nOur primary goal is education and information access, not investment advisory.',
    4,
    true
  ),
  (
    'Contact',
    'contact',
    E'# Contact Us\n\n## Get in Touch\n\nFor general inquiries, technical support, or feedback, please reach out to us.\n\n## Support\n\nEmail: support@example.com\n\n## Business Inquiries\n\nEmail: business@example.com\n\n## Technical Issues\n\nIf you encounter technical problems with the website, please provide:\n- Description of the issue\n- Steps to reproduce\n- Browser and device information\n\n## Response Time\n\nWe aim to respond to all inquiries within 2-3 business days.\n\n## Note\n\nWe do not provide investment advice or financial planning services through any communication channel.',
    5,
    true
  )
ON CONFLICT (slug) DO NOTHING;
