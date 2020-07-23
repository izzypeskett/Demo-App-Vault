# Cryppo JS

TypeScript version of [Cryppo](https://github.com/Meeco/cryppo) allowing easy encryption/decryption for [Meeco](https://dev.meeco.me) in the browser or node.

## Run the demo page

- `npm install`
- `npm start`

Will run the project in `demo/` using parcel. Visit [http://localhost:1234](http://localhost:1234) to show.

## Encrypting Data (Symmetric Key Encryption)

The public facing API is designed to make it as easy as possible to encrypt some data with a key.

**If you want to encrypt with an arbitrary string as a key**:

You can do so using `encryptWithKeyDerivedFromString`. This will return the serialized encrypted data along with some information about the encryption (such as key derivation information). `encryptWithKeyDerivedFromString` and `encryptWithGeneratedKey` have two serialization formats:
a legacy format and a more efficient current format. current format is default format, In order to serialize a structure using the old format please use
`SerializationFormat.legacy`

```ts
import { CipherStrategy, encryptWithKeyDerivedFromString } from '@meeco/cryppo';

async function encryptData() {
  const result = await encryptWithKeyDerivedFromString({
    key: 'Password123!',
    data: 'My Secret Data',
    strategy: CipherStrategy.AES_GCM,
    serializationVersion: SerializationFormat = SerializationFormat.latest_version,
  });
  console.log(result.serialized);
}
```

**If you want to encrypt with a randomly generated key**

You can do so using `encryptWithGeneratedKey`. This will return the generated key.

```ts
async function encryptData() {
  const result = await encryptWithGeneratedKey({
    data: 'My Secret Data',
    strategy: CipherStrategy.AES_GCM,
    serializationVersion: SerializationFormat = SerializationFormat.latest_version,
  });
  console.log(result.serialized);
  console.log(result.generatedKey);
}
```

**If you want to encrypt with an existing key that is of the required length for the given strategy**

You can do so using `encryptWithKey`

```ts
import { encryptWithKeyDerivedFromString, generateRandomKey, CipherStrategy } from '@meeco/cryppo';

async function encryptData() {
  const result = await encryptWithKeyDerivedFromString({
    key: generateRandomKey(32),
    data: 'My Secret Data',
    strategy: CipherStrategy.AES_GCM,
    serializationVersion: SerializationFormat = SerializationFormat.latest_version,
  });
  console.log(result.serialized);
}
```

## Encrypting Data (Asymmetric Key Encryption)

1. Generate a new key pair
1. Use the public key to encrypt
1. Encrypt the private key with a password/phrase (optional)
1. Decrypt with private key

```ts
import { generateRSAKeyPair, encryptWithPublicKey, decryptWithPrivateKey, encryptPrivateKeyWithPassword } from '@meeco/cryppo'

async function encryptDecryptData() {
  const { publicKey, privateKey } = await generateRSAKeyPair();

  const encryptedPrivateKey = encryptPrivateKeyWithPassword({ privateKey, password: 'Password123!' });
  // can store encrypted private key

  const encrypted = await encryptWithPublicKey({
    publicKey,
    data: 'My Super Secret Data',
    serializationFormat: SerializationFormat = SerializationFormat.latest_version
  });

  // Using un-encrypted private key
  const decryptedData = await decryptWithPrivateKey(
    encrypted,
    privateKey
  )
  console.log(decryptedData); // 'My Super Secret Data''

  // Using encrypted private key and password
  const decryptedDataWithEncryptedPrivateKey = await decryptWithPrivateKey(
    encrypted,
    privateKey: encryptedPrivateKey,
    password: 'Password123!'
  );

  console.log(decryptedDataWithEncryptedPrivateKey);  // 'My Super Secret Data''
}
```

## Decryption

**If you have a serialized encrypted payload**

_Note: cryppo will use a derived key or the provided key and correct SerializationFormat based on the structure of the serialized data_.

Call `decryptWithKey`

```ts
async function decryptData() {
  const decrypted = await decryptWithKey({
    serialized: `Aes256Gcm.J9YhaGdIUBKa2dULbMU=.LS0tCml2OiAhYmluYXJ5IHwtCiAgd1JGK2QrRjYzRHJhbDRmdgphdDogIWJpbmFyeSB8LQogIGllS3JnK05iV0JVY2N3L3VVS2N6Rnc9PQphZDogbm9uZQo=.Pbkdf2Hmac.LS0tCml2OiAitIb79btSrS8k4KhbyfR_f79OkukiCmk6IDIxOTQ5Cmw6IDMyCmhhc2g6IFNIQTI1Ngo=`,
    key: 'Password123!',
  });
  console.log(decrypted);
  // 'My Secret Data'
}
```

## Serialization Format

The serialization format of encrypted data is designed to be easy to parse and store.

There are two serialization formats:

- Encrypted data encrypted without a derived key
- Encrypted data encrypted with a derived key

### Encrypted data encrypted without a derived key

A string containing 3 parts concatenated with a `.`.

1. Encryption Strategy Name: The strategy name as defined by EncryptionStrategy#strategy_name
2. Encoded Encrypted Data: Encrypted Data is encoded with Base64.urlsafe_encode64
3. Encoded Encryption Artefacts: Encryption Artefacts are serialized into a hash by EncryptionStrategy#serialize_artefact,
   converted to YAML for legacy & BSON for latest_version, then encoded with Base64.urlsafe_encode64

### Encrypted data encrypted with a derived key

A string containing 5 parts concatenated with a `.`. The first 3 parts are the same as above.

4. Key Derivation Strategy Name: The strategy name as defined by EncryptionStrategy#strategy_name
5. Encoded Key Derivation Artefacts: Encryption Artefacts are serialized into a hash by EncryptionStrategy#serialize_artefact, converted to YAML for legacy & BSON for latest_version, then encoded with Base64.urlsafe_encode64
