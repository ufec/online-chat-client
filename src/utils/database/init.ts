import initSqlJs, { type Database, type QueryExecResult } from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
import { localChatLogs } from './sql';

async function initializeDatabase(filename = 'online_chat.db'): Promise<Database> {
  const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
  const sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);
  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');
  const path = `/sql/${filename}`;
  const db = new SQL.Database(path, { filename });
  // if (typeof SharedArrayBuffer === 'undefined') {
  //   const stream = SQL.FS.open(path, 'a+');
  //   await stream.node.contents.readIfFallback();
  //   SQL.FS.close(stream);
  // }
  db.exec(`
    PRAGMA journal_mode = MEMORY;
    PRAGMA page_size = 8192;
  `);
  return db;
}

export async function getDatabase(filename = 'online_chat.db'): Promise<Database> {
  if (self.onlineChatDb != null) return await Promise.resolve(self.onlineChatDb);
  return await initializeDatabase(filename);
}

export async function init(userId: string | number) {
  if (self.onlineChatDb == null) {
    self.onlineChatDb = await getDatabase(`${userId}.db`);
  }
  const result: QueryExecResult[][] = [];
  // 初始化创建数据库
  result.push(localChatLogs(self.onlineChatDb));
  return result;
}
