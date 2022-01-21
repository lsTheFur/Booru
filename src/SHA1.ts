import * as crypto from 'crypto';
const hash = crypto.createHash('sha1');
export default (text: string) => hash.update(text).digest('hex');
