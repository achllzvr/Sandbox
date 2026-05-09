<?php

return [
    'guest' => [
        [
            'label' => 'Login',
            'route' => 'login',
            'class' => 'nav-link',
        ],
        [
            'label' => 'Register as Taker',
            'route' => 'register.show',
            'class' => 'btn btn-primary nav-btn',
        ],
    ],

    'admin' => [
        [
            'label' => 'Admin Dashboard',
            'route' => 'admin.dashboard',
        ],
        [
            'label' => 'Create Staff',
            'route' => 'admin.staff.create',
        ],
        [
            'label' => 'Create Certification',
            'route' => 'admin.certifications.create',
        ],
        [
            'label' => 'Manage Vouchers',
            'route' => 'admin.vouchers.index',
        ],
        [
            'label' => 'Enrollments',
            'route' => 'admin.enrollments',
        ],
    ],

    'staff' => [
        [
            'label' => 'Staff Dashboard',
            'route' => 'staff.dashboard',
        ],
        [
            'label' => 'Manage Lessons',
            'route' => 'staff.lessons.create',
        ],
        [
            'label' => 'Upload Modules',
            'route' => 'staff.modules.create',
        ],
        [
            'label' => 'Upload Questions',
            'route' => 'staff.questions.create',
        ],
        [
            'label' => 'Enrollments',
            'route' => 'staff.enrollments',
        ],
    ],

    'user' => [
        [
            'label' => 'My Dashboard',
            'route' => 'user.dashboard',
        ],
        [
            'label' => 'Browse Certifications',
            'route' => 'user.dashboard',
            'fragment' => 'available-certifications',
        ],
        [
            'label' => 'My Coursework',
            'route' => 'user.dashboard',
            'fragment' => 'my-coursework',
        ],
    ],
];
