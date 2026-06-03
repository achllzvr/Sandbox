<?php

namespace App\Http\Controllers\Creator\Concerns;

use App\Models\Certification;
use App\Models\Module;

trait AuthorizesCertificationEditing
{
    protected function authorizeCertificationEditing(Certification $certification): void
    {
        if ($certification->created_by_user_id !== auth()->id()) {
            abort(403);
        }

        if (! $certification->isCreatorEditable()) {
            abort(403, 'This shell cannot be edited while it is pending approval.');
        }
    }

    protected function authorizeModuleEditing(Module $module): void
    {
        $module->loadMissing('lesson.certification');

        $this->authorizeCertificationEditing($module->lesson->certification);
    }
}
