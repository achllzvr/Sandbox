@extends('layouts.app')
@section('title', 'Certification Management Platform')

@section('content')
<section class="hero-section">
    <div class="container">
        <h1 class="hero-title">Manage Certifications, Modules, and Certification Takers in One Platform</h1>
        <p class="hero-subtitle">The ultimate professional solution for admins, content_creator, and certification takers.</p>
        <div class="hero-actions">
            <a href="{{ route('register.show') }}" class="btn btn-primary btn-lg">Register as Certification Taker</a>
            <a href="{{ route('login') }}" class="btn btn-secondary btn-lg">Login to Portal</a>
        </div>
    </div>
</section>

<section class="roles-section">
    <div class="container">
        <h2 class="section-title">Platform Roles</h2>
        <div class="grid-3">
            <div class="card role-card">
                <h3>Admin</h3>
                <p>Full control over the system. Admins manage content_creator accounts, create new certifications, and oversee the entire learning platform.</p>
            </div>

            <div class="card role-card">
                <h3>content_creator / Teacher</h3>
                <p>Appointed by admins. content_creator members are responsible for uploading lessons, managing modules, and organizing examination materials.</p>
            </div>

            <div class="card role-card">
                <h3>Certification Taker</h3>
                <p>Students and professionals seeking to earn credentials. Browse available certifications, enroll, and take modules to earn your certificate.</p>
            </div>
        </div>
    </div>
</section>
@endsection
