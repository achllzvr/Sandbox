<div {{ $attributes->merge(['class' => 'card']) }}>
    @isset($title)
        <div class="card-header">
            <h1 class="page-title">{{ $title }}</h1>
            @isset($subtitle)
                <p class="auth-subtitle">{{ $subtitle }}</p>
            @endisset
        </div>
    @endisset

    <div class="card-body">
        {{ $slot }}
    </div>
</div>
