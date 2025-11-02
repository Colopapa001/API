import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "Password123";
        
        // Generate 3 hashes to show they're different each time
        for (int i = 0; i < 3; i++) {
            System.out.println(encoder.encode(password));
        }
    }
}

