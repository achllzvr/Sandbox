<div style="font-family: sans-serif; color: #333;">
    <h2>Hello {{ $content_creator->full_name }},</h2>
    <p>An administrator has created a content_creator account for you on the Certification Platform.</p>
    <p>Here are your login credentials:</p>
    <ul>
        <li><strong>Email:</strong> {{ $content_creator->email }}</li>
        <li><strong>Temporary Password:</strong> {{ $plainPassword }}</li>
    </ul>
    <p>Please log in and update your password if needed.</p>
    <br>
    <p>Best regards,<br>System Administrator</p>
</div>
