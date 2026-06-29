# Turso CLI Usage

## Login

```
turso auth login
```

To confirm who is logged in:

```
turso auth whoami
```

## Check available commands / capabilities

Top-level commands:

```
turso --help
```

Database commands:

```
turso db --help
```

Available `turso db` subcommands: `branch`, `config`, `create`, `destroy`, `export`, `import`, `inspect`, `list`, `locations`, `replicate`, `shell`, `show`, `tokens`, `unarchive`.

Note: there is no `rename` command. To rename a database, create a new one and migrate.