import * as crypto from 'crypto';
const hash = crypto.createHash('sha1');
export const Sha1 = (text: string) => hash.update(text).digest('hex');
export default Sha1;
