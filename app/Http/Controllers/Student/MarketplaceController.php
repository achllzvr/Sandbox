<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $category = (string) $request->input('category', 'all');
        $sort = (string) $request->input('sort', 'price-asc');

        if (! in_array($sort, ['price-asc', 'price-desc'], true)) {
            $sort = 'price-asc';
        }

        $query = Certification::query()
            ->whereIn('status', ['approved', 'published'])
            ->with('creator:id,first_name,last_name');

        if ($search !== '') {
            $like = '%'.$this->escapeLike($search).'%';

            $query->where(function ($builder) use ($like) {
                $builder->where('title', 'like', $like)
                    ->orWhere('description', 'like', $like)
                    ->orWhere('category', 'like', $like)
                    ->orWhere('tags', 'like', $like)
                    ->orWhereHas('creator', function ($creatorQuery) use ($like) {
                        $creatorQuery->where('first_name', 'like', $like)
                            ->orWhere('last_name', 'like', $like);
                    });
            });
        }

        if ($category !== '' && $category !== 'all') {
            if ($category === 'purchased') {
                $enrolledIds = Enrollment::query()
                    ->where('user_id', $request->user()->id)
                    ->pluck('certification_id');

                $query->whereIn('id', $enrolledIds);
            } else {
                $like = '%'.$this->escapeLike($category).'%';

                $query->where(function ($builder) use ($like) {
                    $builder->where('category', 'like', $like)
                        ->orWhere('title', 'like', $like)
                        ->orWhere('tags', 'like', $like);
                });
            }
        }

        $query->orderBy('price', $sort === 'price-desc' ? 'desc' : 'asc')
            ->orderBy('title');

        $certifications = $query->paginate(12)->withQueryString();

        $enrolledCertificationIds = Enrollment::query()
            ->where('user_id', $request->user()->id)
            ->pluck('certification_id')
            ->all();

        $categories = Certification::query()
            ->whereIn('status', ['approved', 'published'])
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        return Inertia::render('Student/Marketplace/Index', [
            'certifications' => $certifications,
            'filters' => [
                'search' => $search,
                'category' => $category !== '' ? $category : 'all',
                'sort' => $sort,
            ],
            'categories' => $categories,
            'enrolledCertificationIds' => $enrolledCertificationIds,
        ]);
    }

    private function escapeLike(string $value): string
    {
        return addcslashes($value, '%_\\');
    }
}
