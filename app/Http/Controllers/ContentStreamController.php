<?php

namespace App\Http\Controllers;

use App\Models\ModuleContent;
use App\Services\ContentStreamService;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContentStreamController extends Controller
{
    public function __construct(
        private ContentStreamService $streamService,
        private EnrollmentService $enrollmentService,
    ) {}

    public function stream(Request $request, ModuleContent $content): StreamedResponse
    {
        if ((int) $request->query('uid') !== (int) $request->user()?->id) {
            abort(403);
        }

        $content->loadMissing('module.lesson');
        $certificationId = (int) $content->module->lesson->certification_id;
        $this->enrollmentService->assertEnrolled($request->user(), $certificationId);

        $path = $this->streamService->resolveStreamPath($content);
        if (! $path || ! is_file($path)) {
            abort(404, 'Content file not found.');
        }

        $mime = mime_content_type($path) ?: 'application/octet-stream';

        return response()->stream(function () use ($path) {
            $handle = fopen($path, 'rb');
            if ($handle) {
                fpassthru($handle);
                fclose($handle);
            }
        }, 200, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="'.basename($path).'"',
            'Cache-Control' => 'private, no-store, max-age=0',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
