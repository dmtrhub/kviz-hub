IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'KvizHubDb')
BEGIN
    CREATE DATABASE KvizHubDb;
    PRINT 'Database KvizHubDb created successfully.';
END
ELSE
BEGIN
    PRINT 'Database KvizHubDb already exists.';
END
GO