const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('./UserRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

class AuthService {
    async login(username, password) {
        const user = await userRepository.findByUsername(username);
        
        if (!user) {
            throw new Error('Sai tên đăng nhập hoặc mật khẩu');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            throw new Error('Sai tên đăng nhập hoặc mật khẩu');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            user: { 
                id: user.id, 
                username: user.username, 
                name: user.name, 
                role: user.role 
            },
            token
        };
    }
}

module.exports = new AuthService();
