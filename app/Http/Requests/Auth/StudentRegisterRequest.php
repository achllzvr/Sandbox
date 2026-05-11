<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;

class StudentRegisterRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'first_name'  => ['required','string','max:100'],
            'last_name'   => ['required','string','max:100'],
            'email'       => ['required','email',
                              'unique:users,email'],
            'password'    => ['required','confirmed','min:8'],
            'birthday'    => ['nullable','date'],
            'contact_no'  => ['nullable','string','max:50'],
            'affiliation' => ['nullable','string','max:255'],
        ];
    }
}
