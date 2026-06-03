<?php

namespace App\Support;

class YoutubeEmbedUrl
{
    public static function extractVideoId(string $url): ?string
    {
        $url = trim($url);

        if ($url === '') {
            return null;
        }

        if (preg_match('#(?:youtube\.com/embed/|youtube-nocookie\.com/embed/)([\w-]{11})#i', $url, $matches)) {
            return $matches[1];
        }

        if (preg_match('#youtu\.be/([\w-]{11})#i', $url, $matches)) {
            return $matches[1];
        }

        if (preg_match('#youtube\.com/(?:shorts/|v/)([\w-]{11})#i', $url, $matches)) {
            return $matches[1];
        }

        $parts = parse_url($url);
        if (! empty($parts['query'])) {
            parse_str($parts['query'], $params);
            if (! empty($params['v']) && preg_match('/^[\w-]{11}$/', $params['v'])) {
                return $params['v'];
            }
        }

        return null;
    }

    public static function toEmbedUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $videoId = self::extractVideoId($url);

        return $videoId ? "https://www.youtube.com/embed/{$videoId}" : null;
    }
}
