'use client';

import React from 'react';
import Image from 'next/image';
import { Twitter, Globe, MapPin, Edit2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ProfileHeaderProps {
    profile: {
        username?: string;
        full_name?: string;
        avatar_url?: string;
        banner_url?: string;
        bio?: string;
        location?: string;
        twitter_handle?: string;
        website?: string;
    };
    isOwnProfile?: boolean;
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
    return (
        <div className="relative mb-20">
            {/* Banner */}
            <div className="h-64 md:h-80 w-full relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                {profile.banner_url && (
                    <Image
                        src={profile.banner_url}
                        alt="Profile Banner"
                        fill
                        className="object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>

            {/* Profile Info Container */}
            <div className="absolute -bottom-16 left-0 right-0 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
                {/* Avatar */}
                <div className="relative group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden bg-secondary relative z-10 shadow-xl">
                        {profile.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt={profile.full_name || 'User'}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                                <User className="w-16 h-16 text-muted" />
                            </div>
                        )}
                    </div>
                    {isOwnProfile && (
                        <button className="absolute bottom-2 right-2 z-20 p-2 bg-accent rounded-full text-white shadow-lg hover:scale-110 transition-transform">
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 pb-2 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black">{profile.full_name || 'Anime Fan'}</h1>
                            <p className="text-muted-foreground font-medium">@{profile.username || 'user'}</p>
                        </div>

                        {isOwnProfile && (
                            <button className="hidden md:flex px-6 py-2 bg-secondary/20 hover:bg-secondary/30 rounded-full font-bold transition-colors items-center gap-2">
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {profile.bio && (
                        <p className="mt-4 max-w-2xl text-foreground/80 leading-relaxed">
                            {profile.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-muted-foreground font-medium">
                        {profile.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {profile.location}
                            </div>
                        )}
                        {profile.twitter_handle && (
                            <a href={`https://twitter.com/${profile.twitter_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                <Twitter className="w-4 h-4" />
                                @{profile.twitter_handle}
                            </a>
                        )}
                        {profile.website && (
                            <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent transition-colors">
                                <Globe className="w-4 h-4" />
                                {new URL(profile.website.startsWith('http') ? profile.website : `https://${profile.website}`).hostname}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
