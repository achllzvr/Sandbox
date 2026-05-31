@props([
    'type' => 'button',
    'color' => 'primary',
    'gated' => false,
])

@php
    $classes = 'btn btn-' . $color;
    if ($gated) {
        $classes .= ' btn-form-gated';
    }
@endphp

<button type="{{ $type }}" {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</button>
