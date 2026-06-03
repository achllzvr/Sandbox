<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AffiliationController extends Controller
{
    /**
     * Distinct affiliation values from users (for registration autocomplete).
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query()
            ->whereNotNull('affiliation')
            ->where('affiliation', '!=', '');

        if ($search = trim((string) $request->query('q', ''))) {
            $query->where('affiliation', 'like', '%'.$search.'%');
        }

        $affiliations = $query
            ->distinct()
            ->orderBy('affiliation')
            ->limit(25)
            ->pluck('affiliation')
            ->values();

        return response()->json(['data' => $affiliations]);
    }
}
