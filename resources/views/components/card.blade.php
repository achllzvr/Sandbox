<div {{ $attributes->merge(['class' => 'card']) }}>
    @isset($title)
        <div class="card-header">
            <h2>{{ $title }}</h2>
            @isset($subtitle)
                <p class="auth-subtitle">{{ $subtitle }}</p>
            @endisset
        </div>
    @endisset
    
    <div class="card-body">
        {{ $slot }}
    </div>
</div>