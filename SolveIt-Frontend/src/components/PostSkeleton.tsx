import React from 'react';
import { View } from 'react-native';

const PostSkeleton = () => {
  return (
    <View accessibilityLabel="PostSkeleton" className="bg-white rounded-[24px] w-full border border-borderStandardLight">
      {/* Header Skeleton */}
      <View className="flex w-full px-[20px] py-3 gap-[15px] border-b border-borderStandardLight flex-row items-center">
        <View className="flex flex-1 flex-row gap-[12px] items-center">
          {/* Avatar Skeleton */}
          <View className="w-[50px] h-[50px] rounded-full bg-gray-200 animate-pulse" />
          <View className="flex gap-1">
            {/* Username Skeleton */}
            <View className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
            {/* Category Skeleton */}
            <View className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </View>
        </View>
        {/* Three dots skeleton */}
        <View className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
      </View>

      {/* Body Skeleton */}
      <View className="w-full px-[20px] py-[16px] gap-[5px]">
        {/* Title Skeleton */}
        <View className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-2" />
        
        {/* Description Skeleton - Multiple lines */}
        <View className="space-y-2">
          <View className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <View className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
          <View className="w-4/6 h-4 bg-gray-200 rounded animate-pulse" />
        </View>

        {/* Tags Skeleton */}
        <View className="w-1/2 h-4 bg-gray-200 rounded animate-pulse mt-2" />

        {/* Image Skeleton */}
        <View className="w-full items-center mt-4">
          <View className="w-full aspect-square max-w-[600px] bg-gray-200 rounded-[16px] animate-pulse" />
        </View>

        {/* Options Skeleton */}
        <View className="flex w-full flex-row justify-center mt-4">
          <View className="flex flex-row gap-4 flex-1">
            {[1, 2, 3].map((index) => (
              <View key={index} className="flex flex-row gap-[5px] items-center">
                <View className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <View className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </View>
            ))}
          </View>
          {/* Favorite icon skeleton */}
          <View className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        </View>
      </View>

      {/* Footer Skeleton */}
      <View className="px-5 py-2 w-full border-t border-borderStandardLight">
        <View className="flex w-full flex-row items-center h-[60px] gap-2">
          <View className="flex flex-1 flex-row gap-2">
            {/* Comment avatar skeleton */}
            <View className="w-[40px] h-[40px] rounded-full bg-gray-200 animate-pulse" />
            {/* Comment input skeleton */}
            <View className="flex-1 h-[40px] rounded-[28px] bg-gray-200 animate-pulse" />
          </View>
          {/* Action buttons skeleton */}
          <View className="flex-row gap-2">
            <View className="w-[42px] h-[42px] rounded-full bg-gray-200 animate-pulse" />
            <View className="w-[42px] h-[42px] rounded-full bg-gray-200 animate-pulse" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostSkeleton;