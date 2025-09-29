import React from "react";
import type { LeaderboardEntry } from "../../models/Leaderboard";
import { FaUser, FaClock, FaAward, FaMedal } from "react-icons/fa";

interface UserRankCardProps {
  userRank: LeaderboardEntry;
}

const UserRankCard: React.FC<UserRankCardProps> = ({ userRank }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 1) return "< 1m";
    return `${Math.round(minutes)}m`;
  };

  const getRankStyle = (position: number) => {
    if (position === 1) return "border-l-4 border-yellow-500";
    if (position === 2) return "border-l-4 border-gray-400";
    if (position === 3) return "border-l-4 border-orange-500";
    return "border-l-4 border-blue-500";
  };

  const getRankBadge = (position: number) => {
    if (position === 1) return { text: "1st", color: "bg-yellow-500 text-white" };
    if (position === 2) return { text: "2nd", color: "bg-gray-500 text-white" };
    if (position === 3) return { text: "3rd", color: "bg-orange-500 text-white" };
    return { text: `${position}th`, color: "bg-blue-500 text-white" };
  };

  const rankBadge = getRankBadge(userRank.position);

  return (
    <div className={`${getRankStyle(userRank.position)} bg-white rounded-2xl p-6 shadow-sm border border-gray-200`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 p-3 rounded-full border border-gray-300">
            <FaUser className="text-gray-600 text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{userRank.username}</h3>
            <p className="text-gray-600 text-sm">{userRank.quizTitle}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${rankBadge.color} font-semibold text-sm`}>
            {rankBadge.text}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <FaAward className="text-gray-400 text-lg mx-auto mb-2" />
          <div className="text-2xl font-semibold text-gray-900">{userRank.percentage}%</div>
          <div className="text-gray-500 text-xs">Score</div>
        </div>
        
        <div className="text-center">
          <FaMedal className="text-gray-400 text-lg mx-auto mb-2" />
          <div className="text-2xl font-semibold text-gray-900">{userRank.score}</div>
          <div className="text-gray-500 text-xs">Points</div>
        </div>
        
        <div className="text-center">
          <FaClock className="text-gray-400 text-lg mx-auto mb-2" />
          <div className="text-2xl font-semibold text-gray-900">{formatDuration(userRank.duration)}</div>
          <div className="text-gray-500 text-xs">Time</div>
        </div>

        <div className="text-center">
          <div className="text-gray-400 text-lg mx-auto mb-2">🏆</div>
          <div className="text-2xl font-semibold text-gray-900">{userRank.position}</div>
          <div className="text-gray-500 text-xs">Rank</div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm text-center">
          Achieved on {formatDate(userRank.achievedAt)}
        </p>
      </div>
    </div>
  );
};

export default UserRankCard;