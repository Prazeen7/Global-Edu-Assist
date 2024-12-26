#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <crypt.h>
#include <pthread.h>

#define SALT "$6$AS$"
#define NUM_LETTERS 26
#define NUM_DIGITS 100
#define MAX_PASSWORD_LENGTH 6 // Increased to 6

int count = 0;
pthread_mutex_t lock;
pthread_mutex_t crypt_lock;

char *salt_and_encrypted;
int NUM_THREADS;
int exit_flag = 0;

// Function to encrypt a password using the crypt function
char *encrypt_password(const char *password, const char *salt) {
    return crypt(password, salt);
}

// Extracts a substring
void substr(char *dest, const char *src, int start, int length) {
    memcpy(dest, src + start, length);
    *(dest + length) = '\0';
}

// Thread function to crack the password
void *crack(void *arg) {
    int thread_id = *(int *)arg;
    char salt[7];
    char plain[MAX_PASSWORD_LENGTH];
    char *enc;

    substr(salt, salt_and_encrypted, 0, 7);

    int total_combinations = NUM_LETTERS * NUM_LETTERS * NUM_DIGITS;
    int range_size = total_combinations / NUM_THREADS;
    int start_index = thread_id * range_size;
    int end_index = (thread_id + 1) * range_size;
    if (thread_id == NUM_THREADS - 1) {
        end_index = total_combinations;
    }

    for (int index = start_index; index < end_index && !exit_flag; index++) {
        if (exit_flag) break;

        int x = index / (NUM_LETTERS * NUM_DIGITS);
        int y = (index / NUM_DIGITS) % NUM_LETTERS;
        int z = index % NUM_DIGITS;

        snprintf(plain, MAX_PASSWORD_LENGTH, "%c%c%02d", 'A' + x, 'A' + y, z);

        pthread_mutex_lock(&crypt_lock);
        enc = crypt(plain, salt);
        pthread_mutex_unlock(&crypt_lock);

        pthread_mutex_lock(&lock);
        count++;

        printf("Thread %d testing: %s, Encrypted: %s\n", thread_id, plain, enc);

        if (strcmp(salt_and_encrypted, enc) == 0 && !exit_flag) {
            exit_flag = 1;
            printf("\nPassword Found: %s\n", plain);
        }
        pthread_mutex_unlock(&lock);
    }

    pthread_exit(NULL);
}

int main() {
    int choice;
    char password[6];
    char encrypted[256];
    pthread_t *threads;
    int *thread_ids;

    printf("Choose an option:\n");
    printf("1. Enter a 4-character password to be encrypted and cracked\n");
    printf("2. Enter an already encrypted password for cracking\n");
    printf("Enter your choice (1 or 2): ");
    scanf("%d", &choice);

    if (choice == 1) {
        printf("Enter a 4-character password (LetterLetterNumberNumber): ");
        scanf("%6s", password);

        strcpy(encrypted, encrypt_password(password, SALT));
        printf("Encrypted Password: %s\n", encrypted);
    } else if (choice == 2) {
        printf("Enter the encrypted password: ");
        scanf("%s", encrypted);
    } else {
        printf("Invalid choice. Exiting program.\n");
        return 1;
    }

    printf("Enter the number of threads to use: ");
    scanf("%d", &NUM_THREADS);

    if (NUM_THREADS <= 0 || NUM_THREADS > 26) {
        printf("Invalid number of threads. Must be between 1 and 26.\n");
        return 1;
    }

    threads = (pthread_t *)malloc(NUM_THREADS * sizeof(pthread_t));
    thread_ids = (int *)malloc(NUM_THREADS * sizeof(int));

    salt_and_encrypted = encrypted;

    pthread_mutex_init(&lock, NULL);
    pthread_mutex_init(&crypt_lock, NULL);

    printf("Starting password cracking with %d threads...\n", NUM_THREADS);
    for (int i = 0; i < NUM_THREADS; i++) {
        thread_ids[i] = i;
        pthread_create(&threads[i], NULL, crack, &thread_ids[i]);
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }

    printf("%d solutions explored\n", count);

    pthread_mutex_destroy(&lock);
    pthread_mutex_destroy(&crypt_lock);
    free(threads);
    free(thread_ids);

    return 0;
}
