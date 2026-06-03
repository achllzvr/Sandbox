<?php

namespace App\Services;

use App\Models\ModuleContent;
use Illuminate\Support\Facades\URL;

class ContentStreamService
{
    public function signedUrl(ModuleContent $content, int $userId): string
    {
        return URL::temporarySignedRoute(
            'content.stream',
            now()->addMinutes(15),
            [
                'content' => $content->id,
                'uid' => $userId,
            ],
        );
    }

    public function resolveStreamPath(ModuleContent $content): ?string
    {
        $relative = $content->file_url;

        if (! $relative || preg_match('/^https?:\/\//i', $relative)) {
            return null;
        }

        $normalized = ltrim(str_replace('storage/', '', $relative), '/');

        return storage_path('app/public/'.$normalized);
    }

    public function mapContentsForStudent($contents, int $userId): array
    {
        return collect($contents)->map(function ($item) use ($userId) {
            $row = is_array($item) ? $item : $item->toArray();
            $type = $row['content_type'] ?? $row['type'] ?? null;

            if (in_array($type, ['youtube_embed'], true)) {
                return $row;
            }

            if (! empty($row['file_url']) && ! preg_match('/^https?:\/\//i', $row['file_url'])) {
                $contentModel = ModuleContent::find($row['id'] ?? 0);
                if ($contentModel) {
                    $extension = strtolower(pathinfo($row['file_url'], PATHINFO_EXTENSION) ?: '');
                    if ($extension !== '') {
                        $row['file_extension'] = $extension;
                    }
                    $row['stream_url'] = $this->signedUrl($contentModel, $userId);
                    $row['file_url'] = null;
                }
            }

            return $row;
        })->all();
    }
}
