## Usage

Copy `config.example.js` to `config.js` and edit it as needed.

```bash
$ yarn
$ ./imap-backup
```

## Development

```bash
$ bin/lint
```

## TODO

- `ag TODO`
- Locally delete what was remotely deleted
- Why am I getting these errors?

  ```
  Fetching message 45837 in mailbox "Deleted Items"...
  Error fetching the message body: Error: Message not found
  ```

  Should I try with `nodeImap.seq.*` methods?