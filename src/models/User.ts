import bcrypt from 'bcrypt';
import {
    BuildOptions,
    DataTypes,
    FindOptions,
    Model,
    Sequelize
} from 'sequelize';

import sequelize from '../config/db';

export interface UserAttributes {
    id?: number;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IUserModel extends Model<UserAttributes>, UserAttributes {
    verifyPassword: (password: string) => boolean;
}

export type UserStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): IUserModel;
    findAndVerifyPassword: (
        options: FindOptions<UserAttributes>,
        password: string
    ) => Promise<boolean>;
};

export const UserFactory = (sequelize: Sequelize): UserStatic =>
    <UserStatic>sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

const UserModel = UserFactory(sequelize);

UserModel.beforeCreate(async user => {
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } catch (err) {
        throw new Error(err);
    }
});

UserModel.prototype.verifyPassword = async function (password: string) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        throw new Error(err);
    }
};

UserModel.findAndVerifyPassword = async function (options, password) {
    const user = await this.findOne(options);
    return user?.verifyPassword(password) || false;
};

export default UserModel;
