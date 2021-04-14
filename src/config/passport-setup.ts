import passport from 'passport';
import passportJwt from 'passport-jwt';

const { Strategy: JwtStrategy, ExtractJwt } = passportJwt;

interface IUser {
    id: number;
    email: string;
    password: string;
}

const users: IUser[] = [
    {
        id: 1,
        email: 'a',
        password: 'b'
    }
];

const JWT_OPTIONS = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};
passport.use(
    new JwtStrategy(JWT_OPTIONS, (payload, done) => {
        console.log({ payload });

        done(null, users[0]);
    })
);

export default passport;
