import { request } from '../utils/request';
import type {
  GetUserInfoDto,
  SearchUserDto,
  SearchUserResultDto,
  UserLoginDto,
  UserLoginResult,
  UserRegisterDto,
  UserRegisterResult,
} from './dto/user.dto';
import { user } from './api';

/**
 * 登录逻辑
 * @param userDto
 * @returns
 */
export async function login(userDto: UserLoginDto) {
  return await request.post<UserLoginResult, UserLoginDto>({
    url: user.loginApi,
    data: userDto,
  });
}

/**
 * 注册逻辑
 * @param userDto
 * @returns
 */
export async function register(userDto: UserRegisterDto) {
  return await request.post<UserRegisterResult, UserRegisterDto>({
    url: user.registerApi,
    data: userDto,
  });
}

/**
 * 用户搜索
 * @param userDto
 * @returns
 */
export async function searchUser(userDto: SearchUserDto) {
  return await request.post<SearchUserResultDto, SearchUserDto>({
    url: user.searchApi,
    data: userDto,
  });
}

/**
 * 通过用户id获取用户公开信息
 * @param userId 用户ID
 * @returns 用户公开信息
 */
export async function getUserPublicInfoById(userId: number) {
  return await request.get<GetUserInfoDto, { userId: number }>({
    url: user.userInfoApi,
    params: { userId },
  });
}
