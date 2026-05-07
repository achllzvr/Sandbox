@props(['label', 'name', 'type' => 'text', 'placeholder' => '', 'required' => false])

<div class="form-group">
    <label for="{{ $name }}">{{ $label }} @if($required) <span class="text-danger">*</span> @endif</label>
    <input 
        type="{{ $type }}" 
        id="{{ $name }}" 
        name="{{ $name }}" 
        value="{{ old($name) }}"
        placeholder="{{ $placeholder }}"
        {{ $required ? 'required' : '' }}
        {{ $attributes->merge(['class' => 'form-control']) }}
    >
    @error($name)
        <span class="error-message">{{ $message }}</span>
    @enderror
</div>