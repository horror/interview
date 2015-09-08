<span><?=$params['msg']?></span> |
If u have accaunt, pls <a href="/?controller=users&action=login">sign in</a>
<form action="/?controller=users&action=registration" method="POST">
    <input  type="text" name="email" value="<?=$params['email']?>">
    <input  type="text" name="password" value="<?=$params['password']?>">
    <input  type="submit" name="submit" value="sign up">
</form>