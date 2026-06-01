<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Support\Mocks\Teacher\TeacherShellMockData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherShopController extends Controller
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
                    ->orWhere('tags', 'like', $like);
            });
        }

        if ($category !== '' && $category !== 'all') {
            $like = '%'.$this->escapeLike($category).'%';

            $query->where(function ($builder) use ($like) {
                $builder->where('category', 'like', $like)
                    ->orWhere('title', 'like', $like)
                    ->orWhere('tags', 'like', $like);
            });
        }

        $query->orderBy('price', $sort === 'price-desc' ? 'desc' : 'asc')
            ->orderBy('title');

        $certifications = $query->paginate(12)->withQueryString();

        $categories = Certification::query()
            ->whereIn('status', ['approved', 'published'])
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        // TODO[backend]: purchasedCertificationIds from teacher cohorts/voucher batches.
        $purchasedCertificationIds = collect(TeacherShellMockData::purchasedShells())
            ->pluck('id')
            ->all();

        return Inertia::render('Teacher/Shop/Index', [
            'certifications' => $certifications,
            'filters' => [
                'search' => $search,
                'category' => $category !== '' ? $category : 'all',
                'sort' => $sort,
            ],
            'categories' => $categories,
            'purchasedCertificationIds' => $purchasedCertificationIds,
        ]);
    }

    private function escapeLike(string $value): string
    {
        return addcslashes($value, '%_\\');
    }
}
