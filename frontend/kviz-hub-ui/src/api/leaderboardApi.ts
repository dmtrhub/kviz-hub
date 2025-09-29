import axiosInstance from './axios';
import type { LeaderboardFilter, LeaderboardResponse } from '../models/Leaderboard';

export const leaderboardApi = {
  getLeaderboard: (filters?: Partial<LeaderboardFilter>): Promise<LeaderboardResponse> => 
    axiosInstance.get('/leaderboards', { params: filters }).then(res => res.data),
    
  getMyRank: (filters?: Partial<LeaderboardFilter>): Promise<LeaderboardResponse> => 
    axiosInstance.get('/leaderboards/me', { params: filters }).then(res => res.data),
};