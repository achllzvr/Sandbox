@extends('layouts.app')
@section('title', 'Sandbox — Learn & Grow')

@section('content')
<section class="hero">
    <div class="hero-mascot">
        <img src="{{ asset('images/HermyLanding.png') }}" alt="Hermit mascot welcoming you to Sandbox" class="hero-image">
    </div>
    <div class="hero-content">
        <h1 class="hero-heading">Break out of your shell and start learning!</h1>
        <p class="hero-subtitle">A warm, playful place to earn certifications, explore lessons, and grow at your own pace.</p>
        <div class="hero-actions">
            <a href="{{ route('register.show') }}" class="btn btn-primary btn-block btn-lg">Get Started</a>
            <a href="{{ route('login') }}" class="btn btn-secondary btn-block btn-lg">I Already Have a Shell</a>
        </div>
        <a href="#roles" class="hero-link">Learn about platform roles</a>
    </div>
</section>

<section class="roles-section" id="roles">
    <div class="container">
        <h2 class="section-title">Platform Roles</h2>
        <div class="grid-3">
            <div class="card role-card">
                <h3>Admin</h3>
                <p>Full control over the system. Admins manage content creator accounts, create certifications, and oversee the learning platform.</p>
            </div>

            <div class="card role-card">
                <h3>Content Creator</h3>
                <p>Appointed by admins. Content creators upload lessons, manage modules, and organize examination materials.</p>
            </div>

            <div class="card role-card">
                <h3>Learner</h3>
                <p>Students and professionals seeking credentials. Browse certifications, enroll, and complete modules to earn your certificate.</p>
            </div>
        </div>
    </div>
</section>
@endsection
