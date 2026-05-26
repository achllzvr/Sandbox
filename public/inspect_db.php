<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=sandbox_db;port=3306', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $tablesQuery = $pdo->query('SHOW TABLES');
    $tables = $tablesQuery->fetchAll(PDO::FETCH_COLUMN);

    $output = "";
    foreach ($tables as $table) {
        $output .= "=== TABLE: {$table} ===\n";
        $columnsQuery = $pdo->query("DESCRIBE `{$table}`");
        $columns = $columnsQuery->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $column) {
            $output .= "{$column['Field']} | {$column['Type']} | {$column['Null']} | {$column['Key']} | {$column['Default']} | {$column['Extra']}\n";
        }
        $output .= "\n";
    }

    file_put_contents(__DIR__ . '/schema_dump.txt', $output);
    echo "SUCCESS: Schema dumped to public/schema_dump.txt";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
