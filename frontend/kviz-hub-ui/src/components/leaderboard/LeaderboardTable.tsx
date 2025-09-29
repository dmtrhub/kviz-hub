import React from "react";
import type { LeaderboardEntry } from "../../models/Leaderboard";
import { FaUser, FaClock, FaTrophy } from "react-icons/fa";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, currentUserId }) => {
  const getRankStyle = (position: number) => {
    if (position === 1) return "text-yellow-600 font-semibold";
    if (position === 2) return "text-gray-600 font-semibold";
    if (position === 3) return "text-orange-600 font-semibold";
    return "text-gray-500";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 1) return "< 1m";
    return `${Math.round(minutes)}m`;
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
        <FaTrophy className="text-gray-300 text-4xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Leaderboard Data</h3>
        <p className="text-gray-600">
          Complete quizzes to appear on the leaderboard
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">
          Leaderboard • {entries.length} {entries.length === 1 ? 'player' : 'players'}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quiz
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => {
              const isCurrentUser = entry.userId === currentUserId;
              
              return (
                <tr 
                  key={entry.id}
                  className={isCurrentUser ? "bg-blue-50" : "hover:bg-gray-50"}
                >
                  {/* Rank */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getRankStyle(entry.position)}`}>
                      {entry.position}
                    </div>
                  </td>
                  
                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCurrentUser ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <FaUser className="text-sm" />
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${isCurrentUser ? "text-blue-600" : "text-gray-900"}`}>
                          {entry.username}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Quiz */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {entry.quizTitle}
                    </div>
                  </td>
                  
                  {/* Score */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {entry.percentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.score} pts
                    </div>
                  </td>
                  
                  {/* Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <FaClock className="text-xs" />
                      <span>{formatDuration(entry.duration)}</span>
                    </div>
                  </td>
                  
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(entry.achievedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;