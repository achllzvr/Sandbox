<header class="app-header">
    <div class="container flex-between">
        <div class="logo">
            <a href="{{ route('home') }}">CertManage</a>
        </div>

        <nav class="main-nav">
            <ul>
                <li>
                    <a href="{{ route('home') }}">Home</a>
                </li>

                @foreach($navLinks as $link)
                    <li>
                        <a href="{{ route($link['route']) }}{{ isset($link['fragment']) ? '#'.$link['fragment'] : '' }}" class="{{ $link['class'] ?? '' }}">
                            {{ $link['label'] }}
                        </a>
                    </li>
                @endforeach

                @if($navRole !== 'guest')
                    <li class="nav-user">
                        <span>{{ $navUserName }}</span>
                    </li>
                    <li>
                        <form method="POST" action="{{ route('logout') }}" class="nav-logout-form">
                            @csrf
                            <button type="submit" class="btn btn-secondary nav-btn">Logout</button>
                        </form>
                    </li>
                @endif
            </ul>
        </nav>
    </div>
</header>