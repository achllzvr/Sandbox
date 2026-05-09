<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Http\Requests\Creator\StoreModuleRequest;

class ModuleController extends Controller {
    public function store(StoreModuleRequest $request) {
        Module::create($request->validated());
        return redirect()->back()->with('success', 'Module created');
    }
}

