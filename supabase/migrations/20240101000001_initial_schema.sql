-- Mobile Dev CRM - Initial Database Schema
-- This migration creates the core tables for the CRM system

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE task_category AS ENUM ('feature', 'bug', 'performance', 'security', 'accessibility', 'technical');
CREATE TYPE requirement_status AS ENUM ('draft', 'approved', 'in_progress', 'completed');
CREATE TYPE requirement_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE requirement_category AS ENUM ('functional', 'non_functional', 'technical', 'design');
CREATE TYPE architecture_node_type AS ENUM ('feature', 'capability', 'component', 'screen', 'api');
CREATE TYPE screen_category AS ENUM ('auth', 'main', 'workout', 'profile', 'settings', 'onboarding');
CREATE TYPE screen_status AS ENUM ('designed', 'in_development', 'completed', 'testing');

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requirements table
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category requirement_category NOT NULL,
    priority requirement_priority NOT NULL,
    status requirement_status DEFAULT 'draft',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Acceptance criteria table
CREATE TABLE acceptance_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requirements history table
CREATE TABLE requirements_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    changes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES requirements(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'todo',
    priority task_priority DEFAULT 'medium',
    category task_category DEFAULT 'feature',
    assignee VARCHAR(255),
    labels TEXT[],
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    github_issue_id INTEGER,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Architecture nodes table
CREATE TABLE architecture_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type architecture_node_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'planned',
    priority VARCHAR(20) DEFAULT 'medium',
    tags TEXT[],
    position_x DECIMAL(10,2),
    position_y DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Architecture edges table
CREATE TABLE architecture_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    source_node_id UUID REFERENCES architecture_nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES architecture_nodes(id) ON DELETE CASCADE,
    label TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Screen nodes table
CREATE TABLE screen_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category screen_category NOT NULL,
    status screen_status DEFAULT 'designed',
    priority VARCHAR(20) DEFAULT 'medium',
    thumbnail_url TEXT,
    position_x DECIMAL(10,2),
    position_y DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Screen flows table
CREATE TABLE screen_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    source_screen_id UUID REFERENCES screen_nodes(id) ON DELETE CASCADE,
    target_screen_id UUID REFERENCES screen_nodes(id) ON DELETE CASCADE,
    label TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kanban boards table
CREATE TABLE kanban_boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kanban columns table
CREATE TABLE kanban_columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    board_id UUID REFERENCES kanban_boards(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status task_status NOT NULL,
    position INTEGER DEFAULT 0,
    wip_limit INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GitHub integration table
CREATE TABLE github_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    owner VARCHAR(255) NOT NULL,
    repo VARCHAR(255) NOT NULL,
    webhook_secret TEXT,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI analytics table
CREATE TABLE ai_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    analysis_type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    insights TEXT,
    recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test results table
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    test_type VARCHAR(50) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    results JSONB,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_assignee ON tasks(assignee);
CREATE INDEX idx_requirements_project_id ON requirements(project_id);
CREATE INDEX idx_requirements_status ON requirements(status);
CREATE INDEX idx_architecture_nodes_project_id ON architecture_nodes(project_id);
CREATE INDEX idx_screen_nodes_project_id ON screen_nodes(project_id);
CREATE INDEX idx_notifications_project_id ON notifications(project_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_architecture_nodes_updated_at BEFORE UPDATE ON architecture_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_screen_nodes_updated_at BEFORE UPDATE ON screen_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kanban_boards_updated_at BEFORE UPDATE ON kanban_boards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_github_integrations_updated_at BEFORE UPDATE ON github_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default project
INSERT INTO projects (id, name, description) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'AI-Fitness Coach 360', 'Mobile fitness application with AI-powered workout analysis');

-- Insert default kanban board
INSERT INTO kanban_boards (id, project_id, name, description, is_default) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Main Board', 'Default kanban board for the project', TRUE);

-- Insert default kanban columns
INSERT INTO kanban_columns (board_id, title, status, position) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'To Do', 'todo', 0),
('550e8400-e29b-41d4-a716-446655440001', 'In Progress', 'in_progress', 1),
('550e8400-e29b-41d4-a716-446655440001', 'Review', 'review', 2),
('550e8400-e29b-41d4-a716-446655440001', 'Done', 'done', 3);
