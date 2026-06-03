<?php

return [
    'guest' => [
        [
            'label' => 'Log In',
            'route' => 'login',
            'class' => 'nav-link',
        ],
        [
            'label' => 'Get Started',
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
            'label' => 'Create Content Creator',
            'route' => 'admin.content_creator.create',
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

    'content_creator' => [
        [
            'label' => 'Content Creator Dashboard',
            'route' => 'content_creator.dashboard',
        ],
        [
            'label' => 'Manage Lessons',
            'route' => 'content_creator.lessons.create',
        ],
        [
            'label' => 'Upload Modules',
            'route' => 'content_creator.modules.create',
        ],
        [
            'label' => 'Upload Questions',
            'route' => 'content_creator.questions.create',
        ],
        [
            'label' => 'Enrollments',
            'route' => 'content_creator.enrollments',
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
