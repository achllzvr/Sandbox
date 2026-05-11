<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;

class TeacherRegisterRequest extends FormRequest
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
            'affiliation' => ['required','string','max:255'],
            'institutional_credentials' => [
                'required','file',
                'mimes:pdf,jpg,jpeg,png',
                'max:5120',
            ],
        ];
    }
}
