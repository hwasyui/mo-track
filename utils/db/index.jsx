const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
import * as schema from './schema'
const sql = neon('postgresql://mo-track_owner:eJlK70UANBuQ@ep-cool-river-a52cgd6b.us-east-2.aws.neon.tech/mo-track?sslmode=require');
export const db = drizzle(sql,{schema});
