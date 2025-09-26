-- Настройка RLS политик для CRM системы

-- Включаем RLS для всех таблиц
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;

-- Создаем политики для анонимного доступа
CREATE POLICY "Allow anonymous access to tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to requirements" ON requirements FOR ALL USING (true);

-- Даем права анонимному пользователю
GRANT ALL ON tasks TO anon;
GRANT ALL ON notifications TO anon;
GRANT ALL ON projects TO anon;
GRANT ALL ON requirements TO anon;

-- Даем права на последовательности
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
