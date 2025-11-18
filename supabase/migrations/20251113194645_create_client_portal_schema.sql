/*
  # Create Client Portal Schema

  ## Overview
  This migration creates the database schema for a real estate client portal application.
  Clients can view budgets, contracts, plans, and project gallery photos uploaded by the real estate company.

  ## New Tables
  
  ### `clients`
  - `id` (uuid, primary key) - Unique client identifier
  - `email` (text, unique) - Client email for authentication
  - `full_name` (text) - Client's full name
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `budgets`
  - `id` (uuid, primary key) - Unique budget identifier
  - `client_id` (uuid, foreign key) - Reference to client
  - `title` (text) - Budget title
  - `pdf_url` (text) - URL to PDF file in storage
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `contracts`
  - `id` (uuid, primary key) - Unique contract identifier
  - `client_id` (uuid, foreign key) - Reference to client
  - `title` (text) - Contract title
  - `pdf_url` (text) - URL to PDF file in storage
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `plans`
  - `id` (uuid, primary key) - Unique plan identifier
  - `client_id` (uuid, foreign key) - Reference to client
  - `title` (text) - Plan title
  - `pdf_url` (text) - URL to PDF file in storage
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `project_photos`
  - `id` (uuid, primary key) - Unique photo identifier
  - `client_id` (uuid, foreign key) - Reference to client
  - `image_url` (text) - URL to image file in storage
  - `description` (text, nullable) - Optional photo description
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Clients can only read their own data
  - Only authenticated users can access data
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  pdf_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  pdf_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own contracts"
  ON contracts FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  pdf_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own plans"
  ON plans FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Create project_photos table
CREATE TABLE IF NOT EXISTS project_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own project photos"
  ON project_photos FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('budgets', 'budgets', false),
  ('contracts', 'contracts', false),
  ('plans', 'plans', false),
  ('project-photos', 'project-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for budgets
CREATE POLICY "Clients can view own budget files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'budgets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for contracts
CREATE POLICY "Clients can view own contract files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for plans
CREATE POLICY "Clients can view own plan files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'plans' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for project photos
CREATE POLICY "Clients can view own project photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'project-photos' AND auth.uid()::text = (storage.foldername(name))[1]);