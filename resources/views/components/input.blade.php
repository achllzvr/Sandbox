@props(['label', 'name', 'type' => 'text', 'placeholder' => '', 'required' => false, 'value' => null])

<div class="form-group">
    <label for="{{ $name }}">{{ $label }} @if($required) <span class="text-danger">*</span> @endif</label>
    <input
        type="{{ $type }}"
        id="{{ $name }}"
        name="{{ $name }}"
        value="{{ old($name, $value) }}"
        placeholder="{{ $placeholder }}"
        {{ $required ? 'required' : '' }}
        {{ $attributes->merge(['class' => 'input-field' . ($required ? ' required-field' : '')]) }}
    >
    @error($name)
        <span class="error-message">{{ $message }}</span>
    @enderror
</div>
