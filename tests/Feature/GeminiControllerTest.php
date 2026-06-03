<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a creator user
        $this->user = User::factory()->create([
            'role' => 'content_creator',
            'is_verified' => true,
        ]);
    }

    /**
     * Test generating questions requires authentication.
     */
    public function test_auth_is_required()
    {
        $response = $this->postJson(route('creator.gemini.generate-questions'), [
            'prompt_type' => 'text',
            'text_prompt' => 'History of ReactJS',
            'api_key' => 'fake_api_key'
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test validation works when API Key is missing.
     */
    public function test_missing_api_key_returns_422()
    {
        $response = $this->actingAs($this->user)->postJson(route('creator.gemini.generate-questions'), [
            'prompt_type' => 'text',
            'text_prompt' => 'History of ReactJS',
        ]);

        $response->assertStatus(422);
        $response->assertJsonStructure(['error']);
    }

    /**
     * Test successful generation and parsing of questions.
     */
    public function test_successful_question_generation()
    {
        // Mock successful Gemini response
        $mockResponse = [
            'candidates' => [
                [
                    'content' => [
                        'parts' => [
                            [
                                'text' => json_encode([
                                    'questions' => [
                                        [
                                            'question_text' => 'What is React?',
                                            'answers' => [
                                                ['answer_text' => 'A JavaScript library', 'is_correct' => true],
                                                ['answer_text' => 'A backend framework', 'is_correct' => false],
                                                ['answer_text' => 'A database', 'is_correct' => false],
                                                ['answer_text' => 'An operating system', 'is_correct' => false]
                                            ]
                                        ],
                                        [
                                            'question_text' => 'Who created React?',
                                            'answers' => [
                                                ['answer_text' => 'Facebook', 'is_correct' => true],
                                                ['answer_text' => 'Google', 'is_correct' => false],
                                                ['answer_text' => 'Microsoft', 'is_correct' => false],
                                                ['answer_text' => 'Twitter', 'is_correct' => false]
                                            ]
                                        ]
                                    ]
                                ])
                            ]
                        ]
                    ]
                ]
            ]
        ];

        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response($mockResponse, 200)
        ]);

        $response = $this->actingAs($this->user)->postJson(route('creator.gemini.generate-questions'), [
            'prompt_type' => 'text',
            'text_prompt' => 'History of ReactJS',
            'api_key_type' => 'custom',
            'api_key' => 'valid_mock_key',
            'num_questions' => 5
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonStructure([
            'success',
            'questions' => [
                '*' => [
                    'question_text',
                    'answers' => [
                        '*' => [
                            'answer_text',
                            'is_correct'
                        ]
                    ]
                ]
            ]
        ]);
        
        $questions = $response->json('questions');
        $this->assertCount(2, $questions);
        $this->assertEquals('What is React?', $questions[0]['question_text']);
        $this->assertTrue($questions[0]['answers'][0]['is_correct']);
    }

    /**
     * Test Gemini API failure handling.
     */
    public function test_gemini_api_error_handling()
    {
        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response([
                'error' => [
                    'message' => 'API key not valid.'
                ]
            ], 400)
        ]);

        $response = $this->actingAs($this->user)->postJson(route('creator.gemini.generate-questions'), [
            'prompt_type' => 'text',
            'text_prompt' => 'History of ReactJS',
            'api_key_type' => 'custom',
            'api_key' => 'invalid_key'
        ]);

        $response->assertStatus(500);
        $response->assertJsonPath('error', 'API key not valid.');
    }
}
