import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken; // ชื่อ Token ที่ตั้งเพื่อที่จะเข้าถึง token ที่สร้างไว้กับตัว '/auth/login' 

    if (!token) {
        return res.status(401).json({ success: false, message: 'You are not authorized' });
    }

    // if token exists then verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => { // ทำการเช็คว่า tokenถูกต้องมั้ย
        if (err) {
            return res.status(401).json({ success: false, message: 'Token is invalid' });
        }
        req.user = user;
        next(); // เรียกใช้ next เพื่อไม่เกิดข้อผิดพลาดและ ส่งต่อไปยัง middleware ถัดไป
    });
};

export const verifyUser = (req, res, next) => { // ตรวจสอบสิทธ์ผู้ใช้
    verifyToken(req, res, next , () => { // เรียกใช้ ฟังชันตัวข้างบน เพื่อเช็คว่า id === params.id มั้ย 
        if (req.user.id === req.params.id || req.user.role === 'admin') {
            next();
        } else {
          return  res.status(401).json({ success: false, message: "You are not wwe" });
        }
    });
};
 
export const verifyAdmin = (req, res, next) => { // ตรวจสอบสิทธ์ admin
    verifyToken(req, res, next , () => {
        if (req.user.role === 'admin') {
            next();
        } else {
          return  res.status(401).json({ success: false, message: "You are not authenticated" });
        }
    });
};