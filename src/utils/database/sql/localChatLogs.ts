import type { MsgEntity } from '@/common/interface';
import type { Database } from '@jlongster/sql.js';

export function localChatLogs(db: Database) {
  return db.exec(`
    CREATE TABLE IF NOT EXISTS 'local_chat_logs' (
      'id' INTEGER PRIMARY KEY,
      'created_at' DATE,
      'updated_at' DATE,
      'msg_id' VARCHAR(255),
      'from_user_id' INTEGER,
      'to_user_id' INTEGER,
      'content' TEXT,
      'msg_type' TINYINT DEFAULT 1,
      'status' TINYINT DEFAULT 1,
      'msg_from_type' TINYINT DEFAULT 1
    );
  `);
}

/**
 * 插入聊天记录
 * @param db 数据库实例
 * @param data 数据
 * @returns 执行结果
 */
export function insertToLocalChatLogs(db: Database, data: MsgEntity) {
  return db.exec(`
    INSERT INTO local_chat_logs (created_at, updated_at, msg_id, from_user_id, to_user_id, content, msg_type, status, msg_from_type)
    VALUES ('${data.createdAt}', '${data.updatedAt}', '${data.msgId}', ${data.fromUserId}, ${data.toUserId}, '${data.content}', ${data.msgType}, ${data.status}, ${data.msgFromType});
  `);
}

/**
 * 查询聊天记录
 * @param db 数据库实例
 * @param fromUserId 发送者id
 * @param toUserId 接收者id
 * @returns 查询结果
 */
export function findFromLocalChatLogs(db: Database, fromUserId: number, toUserId: number) {
  return db.exec(`
    SELECT * FROM local_chat_logs WHERE from_user_id = ${fromUserId} AND to_user_id = ${toUserId};
  `);
}
