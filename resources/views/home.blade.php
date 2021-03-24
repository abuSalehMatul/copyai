<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Copy Ai Spec</title>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-BHY7V3ZWN6"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-BHY7V3ZWN6');
    </script>
    <!-- Styles -->
    <script>
        window.app_url = "{{config('shopify.SHOPIFY_APP_URL')}}";
    </script>
    <link href="{{ asset('css/app.css?v='.rand(0,2999)) }}" rel="stylesheet">
    <script src="{{asset('/tinymce/tinymce.min.js')}}"></script>
</head>
<body>
    <div id="app" data-id = {{  $shop }} data-state = {{$stateToken}} data-allupload={{$allProductUpload}}>
        
    </div>
    <script src="{{ asset('js/app.js?v='.rand(0,2000)) }}"></script>
    <script> 
       
    </script>
</body>
</html>
